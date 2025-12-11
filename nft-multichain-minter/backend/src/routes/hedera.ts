import {Router} from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadImageToIpfs, uploadMetadataToIpfs } from "../chains/hedera/ipfs";
import { buildHederaMetadata} from "../chains/hedera/metadata";
import {mintHederaNftToUser} from "../chains/hedera/mint";
import { validateUpload } from "../middleware/validateUpload";
import { validateMetadata } from "../middleware/validateMetadata";
import { rateLimiterPerChain } from "../middleware/rateLimiterPerChain";

const router = Router();

const upload = multer({
    dest: path.join(__dirname,"..","..","..","tmp","uploads"),
});

router.post(
    "/mint",
    upload.single("file"),
    validateUpload,
    validateMetadata,
    rateLimiterPerChain("hedera"),
    async(req,res,next) => {
        try { 
            const file = req.file;
            const {name,description,userAccountId, attributes} = req.body;

            if(!file){
                return res.status(400).json({error: "File is required"});
            }
            if(!name || !description || !userAccountId){
                return res.status(400).json({error: "Name, description and userAccountId are required"});
            }

            const localFilePath = file.path;

            const imageIpfsUri = await uploadImageToIpfs(localFilePath);

            let parsedAttributes: any[] = [];
            if (attributes) {
                try {
                    parsedAttributes = JSON.parse(attributes);
                } catch {

                }
            }

            const metadata = buildHederaMetadata({
                name, 
                description,
                imageIpfsUri,
                creatorWallet: userAccountId,
                attributes: parsedAttributes,
            });

                  // 3) Upload metadata to IPFS
      const metadataIpfsUri = await uploadMetadataToIpfs(metadata);

      // clean up local file
      fs.unlink(localFilePath, () => null);

      // 4) Mint Hedera NFT and transfer to user
      const { tokenId, serialNumber } = await mintHederaNftToUser({
        userAccountId,
        metadataIpfsUri,
      });

      return res.json({
        success: true,
        tokenId,
        serialNumber,
        imageIpfsUri,
        metadataIpfsUri,
        metadata,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
        
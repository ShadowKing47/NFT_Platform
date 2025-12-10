import {Router} from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {uploadImageToIpfs, uploadMetadataToIpfs} from "../chains/ethereum/ipfs";
import { buildErc721Metadata } from "../chains/ethereum/metadata";
import { validateUpload } from "../middleware/validateUpload";
import { validateMetadata } from "../middleware/validateMetadata";
import { rateLimiterPerChain } from "../middleware/rateLimiterPerChain";

const router = Router();

const upload = multer({
    dest: path.join(__dirname, "..","..","..","tmp","uploads"),
});

router.post(
    "/prepare-mint",
    upload.single("file"),
    validateUpload,
    validateMetadata,
    rateLimiterPerChain("ethereum"),
    async(req,res,next) => {
        try{
            const file = req.file;
            const {name,description, walletAddress, attriutes} = req.body;
             if(!file) {
                return res.status(400).json({error: "File is required"});
             }

             if (!name || !description){
                return res.status(400).json({error: "Name and description are required"});
             }

             const localFilePath = file.path;

             const imageIpfsUri = await uploadImageToIpfs(localFilePath);

             let parsdAttributes: any[] = [];
             if(attributes){
                try{
                    parsdAttributes = JSON.parse(attributes);
                }catch{

                }
             }

             const metadata = buildErc721Metadata({
                name,
                description,
                imageIpfsUri,
                connectWallet: walletAddress
                attriutes: parsdAttributes,
                externalUrl: undefined,
             });

             const tokenUri = await uploadMetadataTOIpfs(metadata);

             return res.json({
                sucess: true,
                tokenUri,
                imageIpfsUri,
                metadata,
             });
        }catch (err) {
            next(err);
        }
    }
);

export default router;
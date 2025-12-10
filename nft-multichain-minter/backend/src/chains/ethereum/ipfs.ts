import {NFTStorage, File} from "nft.storage";
import fs from "fs";
import path from "path";

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY ||"";

if(!NFT_STORAGE_KEY){
    console.warn("NFT_STORAGE_KEY missing, IPFS will not set");
}

const client = new NFTStorage({token: NFT_STORAGE_KEY});

export async function uploadImageToIpfs(localFilePath: string): Promise<string> {
    const data = fs.promises.readFile(localFilePath);
    const fileName = path.basename(localFilePath);


    const file = new File([data], filename, {type:"img/png"});
    const cid = await client.storeBlob(file);

    return 'ipfs://${cid}';
}

export async function uploadMetadataToIpfs(metadata: unknown): Promise<string> {
    const json = JSON.stringify(metadata);
    const file = new File([json], "metadata.json", {
        type: "application/json",
    });

    const cid = await client.storeBlob(file);

    return 'ipfs://${cid}';
}

// pages/api/translate.js

import { NextApiRequest, NextApiResponse } from "next";
import * as deepl from 'deepl-node';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { text, target_lang } = req.body; 
        console.log("BODY", req.body);
        // const authKey = process.env.NEXT_PUBLIC_DEEPL_AUTH_KEY!; 

        const translator = new deepl.Translator("c5157929-9815-4a46-b4c2-5de48ec5587e:fx");
        const result = await translator.translateText(text, null, target_lang)
        console.log( result);
        res.status(200).json({ text, target_lang, result });
}
}
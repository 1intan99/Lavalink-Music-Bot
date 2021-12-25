import { Router } from "express";

export const router = Router()
    .get('/', (req, res) => res.render("kiara"))
    .get('/bot', (req, res) => res.render("bot"))
    .get('/nao', (req, res) => res.redirect("https://discord.com/oauth2/authorize?client_id=904209927415930950&scope=applications.commands%20bot&permissions=439663587071"))
    .get('/nao-tomori', (req, res) => res.redirect("https://discord.com/oauth2/authorize?client_id=492600047268134912&scope=applications.commands%20bot&permissions=439663587071"))
    .get('/narberal', (req, res) => res.redirect("https://discord.com/oauth2/authorize?client_id=480644131782131732&scope=applications.commands%20bot&permissions=439663587071"));

export default router;
import { Router } from "express";

export const router = Router()
    .get('/', (req, res) => res.render("kiara"))
    .get('/bot', (req, res) => res.render("bot"))
    .get('/nao', (req, res) => res.redirect("https://discord.com/oauth2/authorize?client_id=904209927415930950&permissions=155629447415&scope=bot%20applications.commands"))
    .get('/nao-tomori', (req, res) => res.redirect("https://discord.com/oauth2/authorize?client_id=492600047268134912&permissions=155629447415&scope=bot%20applications.commands"))
    .get('/narberal', (req, res) => res.redirect("https://discord.com/oauth2/authorize?client_id=480644131782131732&permissions=155629447415&scope=bot%20applications.commands"));

export default router;
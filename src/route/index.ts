import { Router } from "express";

export const router = Router()
    .get('/', (req, res) => res.render("kiara"))
    .get('/bot', (req, res) => res.render("bot"));

export default router;
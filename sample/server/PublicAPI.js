import Express from 'express';
export function PublicAPI (adminUtil){
    const router = Express.Router();
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action){
            case "getRoster":
                res.status(400).send("GG");
                break;
            default:
                next();
                break;
        }
        
    });
    return router;
}
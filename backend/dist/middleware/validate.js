import * as z from 'zod';
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const zError = error.issues[0].message;
            return res.status(500).json({ message: zError });
        }
        return res.status(400).json({ message: "Invalid Data", error: error });
    }
};
//# sourceMappingURL=validate.js.map
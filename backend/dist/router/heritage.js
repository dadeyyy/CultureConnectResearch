import express from "express";
import { db } from "../utils/db.server.js";
import { catchAsync } from "../middleware/errorHandler.js";
import ExpressError from "../middleware/ExpressError.js";
import { isAuthenticated, isProvinceAdmin, validate, } from "../middleware/middleware.js";
import { uploadHeritage } from "../utils/cloudinary.js";
import { heritageSchema } from "../utils/Schemas.js";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const heritageRoute = express.Router();
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = Geocoding({ accessToken: mapboxToken });
heritageRoute.get("/heritages", isAuthenticated, catchAsync(async (req, res) => {
    console.log("test");
    const allHeritage = await db.heritage.findMany({
        include: { files: true },
    });
    if (allHeritage) {
        return res.status(200).json(allHeritage);
    }
    throw new ExpressError("No heritage", 404);
}));
heritageRoute.post("/heritage/:province", isAuthenticated, isProvinceAdmin, uploadHeritage.array("heritage"), validate(heritageSchema), catchAsync(async (req, res) => {
    try {
        const data = req.body;
        console.log("Data", data);
        const files = req.files;
        const heritageFile = files.map((file) => ({
            url: file.path,
            filename: file.filename,
        }));
        const geoData = await geocoder
            .forwardGeocode({
            query: `${data.municipality}, ${req.session.user?.province ?? ""}`,
            limit: 1,
        })
            .send();
        const location = geoData.body.features[0].geometry;
        const newHeritage = await db.heritage.create({
            data: {
                ...data,
                location: location,
                userId: req.session.user?.id,
                files: {
                    create: heritageFile,
                },
            },
            include: {
                files: true,
                user: true,
            },
        });
        console.log(newHeritage);
        if (newHeritage) {
            return res.status(201).json({
                message: "Successfully created new heritage",
                data: newHeritage,
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
heritageRoute.delete("/heritage/:province/:heritageId", isAuthenticated, isProvinceAdmin, catchAsync(async (req, res) => {
    const { heritageId } = req.params;
    const heritage = await db.heritage.findUnique({
        where: {
            id: +heritageId,
        },
        include: {
            user: true,
        },
    });
    if (!heritage) {
        throw new ExpressError("No heritage", 404);
    }
    const deletedHeritage = await db.heritage.delete({
        where: {
            id: +heritageId,
        },
    });
    if (deletedHeritage) {
        return res.status(200).json({ message: "Heritage deleted succesfully" });
    }
    throw new ExpressError("Failed to delete heritage", 400);
}));
heritageRoute.get("/deleteHeritage", async (req, res) => {
    const deletedHeritage = await db.heritage.deleteMany();
    res.json(deletedHeritage);
});
export default heritageRoute;
//# sourceMappingURL=heritage.js.map
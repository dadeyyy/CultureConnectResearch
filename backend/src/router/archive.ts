import express from 'express';
import { db } from '../utils/db.server.js';
import {
  isAuthenticated,
  validate,
  isAdmin,
} from '../middleware/middleware.js';
import { archiveSchema, archiveTypeSchema } from '../utils/Schemas.js';
const archiveRoute = express.Router();

//Getting all the archives
archiveRoute.get('/archive', isAuthenticated, async(req,res)=>{
    try{
        const archives = await db.archive.findMany({})

        if(archives){
            return res.status(200).json({archives})
        }

        return res.status(404).json({message:"No archives found"})
    }
    catch(error){
        res.status(500).json({error})
    }
})

// Creating an archive
archiveRoute.post(
  '/archive',
  isAuthenticated,
  isAdmin,
  validate(archiveSchema),
  async (req, res) => {
    try {
      const data = req.body;

      const newArchive = await db.archive.create({
        data,
      });

      res
        .status(201)
        .json({ message: 'Archive created successfully', data: newArchive });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Updating an archive
archiveRoute.put(
  '/archive/:archiveId',
  isAuthenticated,
  isAdmin,
  validate(archiveSchema),
  async (req, res) => {
    try {
      const archiveId = parseInt(req.params.archiveId);
      const data = req.body;

      const archive = await db.archive.findUnique({
        where: {
          id: archiveId,
        },
      });

      if (!archive) {
        return res.status(404).json({ error: 'Archive not found!' });
      }

      const updatedArchive = await db.archive.update({
        where: { id: archiveId },
        data,
      });

      res
        .status(200)
        .json({
          message: 'Archive updated successfully',
          data: updatedArchive,
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Deleting an archive
archiveRoute.delete(
  '/archive/:archiveId',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const archiveId = parseInt(req.params.archiveId);

      const archive = await db.archive.findUnique({
        where: {
          id: archiveId,
        },
      });

      if (!archive) {
        return res.status(404).json({ error: 'Archive not found!' });
      }

      await db.archive.delete({
        where: { id: archiveId },
      });

      res.status(200).json({ message: 'Archive deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);
export default archiveRoute;

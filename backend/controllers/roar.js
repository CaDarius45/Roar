const Roar = require('../models/roar');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');

/* ========= Protected Routes ========= */

router.use(verifyToken);

// Create Route
router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const roar = await Roar.create(req.body);
        roar._doc.author = req.user;
        res.status(201).json(roar);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// Index Route
router.get('/', async (req, res) => {
    try {
        const foundRoars = await Roar.find({}).populate('author').sort({ createdAt: 'desc' });;
        res.status(200).json(foundRoars);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//show
router.get('/:roarId', async (req, res) => {
    try {
    //   const Roar = await Roar.findById(req.params.RoarId).populate('author');
      const roar = await Roar.findById(req.params.RoarId)
      res.status(200).json(roar);
    } catch (error) {
      res.status(500).json(error);
    }
});

// Update Route
router.put('/:roarId', async (req, res) => {
    try {
        const roar = await Roar.findById(req.params.RoarId);
        // Add a check for a not found Roar
        if (!roar) {
            res.status(404);
            throw new Error('Roar not found.')
        }
        // Check permissions:
        if (!roar.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }
        const updatedRoar = await Roar.findByIdAndUpdate( req.params.RoarId, req.body, { new: true })
        // Return the updated Roar if found
        res.status(200).json(updatedRoar);
    } catch (error) {
        if (res.statusCode === 404) {
            res.json({ error: error.message })
        } else {
            res.status(501).json({ error: error.message })
        }
    }
})

// Delete route
router.delete('/:roarId', async (req, res) => {
    try {
        const roar = await Roar.findById(req.params.RoarId);
        // Add a check for a not found Roar
        if (!roar) {
            res.status(404);
            throw new Error('Roar not found.')
        }
        //Check if user is authriozed to delete
        if (!roar.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }
        const deletedRoar = await Roar.findByIdAndDelete(req.params.RoarId)
        // Return an "OK" status if the Roar was deleted successfully
        res.status(200).json(deletedRoar);
    } catch (error) {
        if (res.statusCode === 404) {
            res.json({ error: error.message })
        } else {
            res.status(500).json({ error: error.message })
        }
    }
})

//create commement
router.post('/:roarId/comments', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const roar = await Roar.findById(req.params.roarId);
      Roar.comments.push(req.body);
      await Roar.save();
  
      // Find the newly created comment:
      const newComment = Roar.comments[roar.comments.length - 1];
  
      newComment._doc.author = req.user;
  
      // Respond with the newComment:
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json(error);
    }
});

//edit commement
router.put('/:roarId/comments/:commentId', async (req, res) => {
    try {
      const roar = await Roar.findById(req.params.roarId);
      const comment = roar.comments.id(req.params.commentId);
      comment.text = req.body.text;
      await roar.save();
      res.status(200).json({ message: 'Ok' });
    } catch (err) {
      res.status(500).json(err);
    }
});

//delete commement
router.delete('/:roarId/comments/:commentId', async (req, res) => {
    try {
      const roar = await Roar.findById(req.params.roarId);
      roar.comments.remove({ _id: req.params.commentId });
      await roar.save();
      res.status(200).json({ message: 'Ok' });
    } catch (err) {
      res.status(500).json(err);
    }
});

// Export Routes
module.exports = router;
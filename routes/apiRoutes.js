const fs = require('fs');
const path = require('path');
const router = require('express').Router();


router.get('/notes', (req, res) => {
    console.log (3)
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read the notes data' });
        }
        res.json(JSON.parse(data)); 
    });
});


router.post('/notes', (req, res) => {
    const newNote = req.body;


if (!newNote.title || !newNote.text) {
    return res.status(400).json({ error: 'Both title and text are required' });
}

   
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read the notes data' });
        }

        const notes = JSON.parse(data);

      
        newNote.id = Date.now().toString();

        
        notes.push(newNote);

        
        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to save the note' });
            }
            res.json(newNote); 
        });
    });
});



router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id; 

  
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read the notes data' });
        }

        let notes = JSON.parse(data);

        
        notes = notes.filter(note => note.id !== noteId);

       
        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to delete the note' });
            }
            res.json({ message: 'Note deleted successfully' });
        });
    });
});


module.exports = router;
const mongoose = require('mongoose');



const votesSchema = new mongoose.Schema(
    {
        topicId: { type: mongoose.Types.ObjectId, required: true },
        choiceId: { type: Number, required: true },
        voterId: { type: String, required: true },
    },

    { 
        timestamps: true,
        collation:  {
                        locale: 'en_US',
                        caseLevel: true,
                        strength: 2
                    }
    },
        
)

const Vote = mongoose.model('Votes', votesSchema);


module.exports = Vote;
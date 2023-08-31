const mongoose = require('mongoose');

const topicsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        choices: { type: Array, required: true },
        votes: { type: Array, default: [] },
        results: { type: Array, default: [] },
        status: { type: String, default: "active" }
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

const Topic = mongoose.model('Topics', topicsSchema);


module.exports = Topic;
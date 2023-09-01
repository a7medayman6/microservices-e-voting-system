const mongoose = require('mongoose');



const votersSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        voterId: { type: String, required: true, unique: true },
        status: { type: String, default: "active" },
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

const Voter = mongoose.model('Voters', votersSchema);


module.exports = Voter;
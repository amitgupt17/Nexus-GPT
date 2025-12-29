import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
export const AllThreads = async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch threads" });
    }
};
export const SpecificMessage =  async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
       
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch chat" });
    };
};
export const Delete = async (req, res,next) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({success: "Thread could be deleted successfully"});
    
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch chat" });
    };
};
export const Chat =  async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) {
        res.status(400).json({ error: "missing field is required" });
    }
    try {
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [{
                    role: "user",
                    content: message
                }]
            });
        } else{
            thread.messages.push({
                role:"user",
                content:message
            });
        }
        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({
            role:"assistant",
            content: assistantReply
        });
        thread.updatedAt = new Date();
        await thread.save();
        res.json({assistantReply});
     
    } catch(err){
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
};
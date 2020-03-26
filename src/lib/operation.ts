import { Vote } from "../models/vote"
import { Publication } from "../models/publication";



const votesPublication = async (id: any): Promise<number> => {
    const votes = await Vote.find({ publication: id }).countDocuments();
    return votes;
}

const getPublication = async (): Promise<any[]> => {
    const publications = await Publication.find({}).sort({ createAt: -1 }).populate('user');
    return publications;
}

export {
    votesPublication,
    getPublication
}
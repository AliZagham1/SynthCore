import {auth } from "@clerk/nextjs/server";
import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
    const { userId } = await auth();
    if (!userId) {
        return;
    }
   
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            id: userId
        }
    });
    if (userApiLimit) {
        await prismadb.userApiLimit.update({
            where: {
                id: userId
            },
            data: {
                count: userApiLimit.count + 1
            }
        });
    } else {
        await prismadb.userApiLimit.create({
            data: {
                id: userId,
                user: userId,
                count: 1
            }
        });
    }
}
        

export const checkApiLimit = async () => {
    const { userId } = await auth();
    if (!userId) {
        return false;
    }
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            id: userId
        }
    });
    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true;
    }
    return false;
}


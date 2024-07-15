import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams
    const userId = await params.get("userId")
    const pageNo = await params.get("pageNo")
    const limit = 20;
    if (!userId || !pageNo) {
        return NextResponse.json({
            error: "Invalid parameteres"
        }, {
            status: 400
        })
    }
    // fetch data from database or API
    try {
        await connectDatabase()
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return NextResponse.json({
                error: "User with this userId does not found"
            }, {
                status: 404
            })
        } else {
            const detailData = await prisma.follows.findMany({
                where: {
                    followingId: userId
                },
                skip: (parseInt(pageNo) - 1) * limit,
                take: limit,
                include: {
                    followedBy: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                            userName: true,
                            followers: {
                                where: {
                                    followedById: userId,
                                },
                                select: {
                                    followedById: true
                                }
                            }
                        }
                    }
                }
            });
            const data: any = await detailData
            await data.map((d: any) => {
                if (d.followedBy.followers[0].followedById == userId) {
                    d.followedBy.isFollowed = true
                }
            }
            )

            return NextResponse.json({
                followers: data,
                // agg
            })
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        })
    }
}
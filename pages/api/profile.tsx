import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
    runtime: "experimental-edge",
};

const inter400 = fetch(
    new URL("../../assets/inter-latin-ext-400-normal.woff", import.meta.url)
).then((res) => res.arrayBuffer());
const inter700 = fetch(
    new URL("../../assets/inter-latin-ext-700-normal.woff", import.meta.url)
).then((res) => res.arrayBuffer());

const elapsedTime = (timestamp, endTime?) => {
    let startTime = timestamp;
    if (!endTime) endTime = Number(new Date());
    let difference = (endTime - startTime) / 1000;

    // we only calculate them, but we don't display them.
    // this fixes a bug in the Discord API that does not send the correct timestamp to presence.
    let daysDifference = Math.floor(difference / 60 / 60 / 24);
    difference -= daysDifference * 60 * 60 * 24;

    let hoursDifference = Math.floor(difference / 60 / 60);
    difference -= hoursDifference * 60 * 60;

    let minutesDifference = Math.floor(difference / 60);
    difference -= minutesDifference * 60;

    let secondsDifference = Math.floor(difference);

    return `${
        hoursDifference >= 1 ? ("0" + hoursDifference).slice(-2) + ":" : ""
    }${("0" + minutesDifference).slice(-2)}:${("0" + secondsDifference).slice(
        -2
    )}`;
};

export default async function handler(request: NextRequest) {
    try {
        const inter400Data = await inter400;
        const inter700Data = await inter700;

        const { searchParams } = new URL(request.url);

        const userId = "303173495918034945";
        const shouldShowAvatar = true;
        const username = null;
        const pronouns = null;

        const socials = [
            { key: "roblox", value: "hvrtlvs" },
            { key: "discord", value: "sixfalls#0001" },
        ];

        const data = await fetch(
            `https://api.lanyard.rest/v1/users/${userId}`
        ).then(async (res) => (await res.json()).data);

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "1400px",
                        width: "1580px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                    className="bg-slate-800"
                >
                    <div className="after:block after:relative after:h-24 after:mt-[-6rem] after:bg-gradient-to-b after:from-transparent after:to-slate-800 after:z-10">
                        <img
                            width="100%"
                            src={`https://dcdn.dstn.to/banners/${userId}?size=2048`}
                        />
                    </div>

                    {shouldShowAvatar ? (
                        <img
                            className="rounded-full mt-[-16rem] ml-12 z-20 shadow-xl shadow-slate-700"
                            width="328px"
                            src={`https://dcdn.dstn.to/avatars/${userId}?size=512`}
                        />
                    ) : null}

                    {data ? (
                        data.activities[0].type == 2 ? (
                            <div className="self-end mx-12 absolute top-[668px] uppercase font-bold text-2xl text-slate-300 items-end flex flex-col">
                                <span>Listening to Spotify</span>
                                <div className="w-full flex flex-row my-4">
                                    <div className="flex flex-col normal-case font-normal items-end">
                                        <span className="text-slate-300 font-bold">
                                            {data.spotify.song}
                                        </span>
                                        <span className="text-slate-400">
                                            by {data.spotify.artist}
                                        </span>
                                        <span className="text-slate-400">
                                            on {data.spotify.album}
                                        </span>
                                    </div>
                                    <img
                                        width="130px"
                                        className="ml-6 inline-block rounded-xl"
                                        src={data.spotify.album_art_url}
                                    />
                                </div>
                            </div>
                        ) : data.activities[0].type == 0 ? (
                            <div className="self-end mx-12 absolute top-[668px] uppercase font-bold text-2xl text-slate-300 items-end flex flex-col">
                                <span>Playing a game</span>
                                <div className="w-full flex flex-row my-4">
                                    <div className="flex flex-col normal-case font-normal items-end">
                                        <span className="text-slate-300 font-bold">
                                            {data.activities[0].name}
                                        </span>
                                        <span className="text-slate-400">
                                            {data.activities[0].details}
                                        </span>
                                        <span className="text-slate-400">
                                            {data.activities[0].state}
                                        </span>
                                        <span className="text-slate-400">
                                            {data.activities[0].timestamps &&
                                            data.activities[0].timestamps
                                                .start ? (
                                                <span>
                                                    {elapsedTime(
                                                        data.activities[0]
                                                            .timestamps.start
                                                    )}{" "}
                                                    elapsed
                                                </span>
                                            ) : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    ) : null}

                    <div className="flex m-12">
                        <div className="flex flex-col">
                            <span className="font-bold text-6xl text-white">
                                {username
                                    ? username
                                    : data
                                    ? data.discord_user.username
                                    : "unknown"}
                            </span>
                            <span className="font-normal text-3xl text-slate-300 mb-6">
                                {pronouns
                                    ? pronouns
                                    : data && data.kv.pronouns
                                    ? data.kv.pronouns
                                    : null}
                            </span>
                            {socials.map((object, i) => (
                                <div
                                    className="font-normal text-3xl text-slate-400"
                                    key={i}
                                >
                                    <span
                                        className={`icon-${object.key} mr-2`}
                                    />
                                    {object.value}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1580,
                height: 1400,
                fonts: [
                    {
                        name: "Inter",
                        data: inter400Data,
                        weight: 400,
                        style: "normal",
                    },
                    {
                        name: "Inter",
                        data: inter700Data,
                        weight: 700,
                        style: "normal",
                    },
                ],
            }
        );
    } catch (e: any) {
        console.log(e);
        return new Response("Failed to generate image", { status: 500 });
    }
}

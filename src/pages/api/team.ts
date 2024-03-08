import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch(
    "https://api.dscinflux.xyz/v1/team" //not up but still added it
  );
  const data = await response.json();
  res.status(200).json(data);
};
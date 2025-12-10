import { Request, Response, NextFunction } from "express";

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;

export const validateMetadata = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, attributes } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name is required and must be a string" });
  }

  if (name.length > MAX_NAME_LENGTH) {
    return res.status(400).json({
      error: `Name must not exceed ${MAX_NAME_LENGTH} characters`,
    });
  }

  if (!description || typeof description !== "string") {
    return res.status(400).json({ error: "Description is required and must be a string" });
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return res.status(400).json({
      error: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
    });
  }

  if (attributes) {
    try {
      const parsed = JSON.parse(attributes);
      if (!Array.isArray(parsed)) {
        return res.status(400).json({
          error: "Attributes must be a valid JSON array",
        });
      }
    } catch (err) {
      return res.status(400).json({
        error: "Attributes must be a valid JSON array",
      });
    }
  }

  next();
};

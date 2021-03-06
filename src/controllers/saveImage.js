const Image = require("../entities/Image")
const database = require("../entities/Database")
const { BadRequestApiError } = require("../validators/ApiError")

module.exports = async (req, res, next) => {
  try {
    const file = req.file

    if (!file) {
      throw new BadRequestApiError("No file attached")
    }

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      throw new BadRequestApiError(
        "Prohibited format, only .jpeg and .png images are accepted"
      )
    }

    const { buffer, size, mimetype } = file

    const image = new Image(size, mimetype)
    await database.insert(image, buffer)

    return res.json({ id: image.id })
  } catch (err) {
    return next(err)
  }
}

const db = require("../../data/db-config");
const Scheme = "./scheme-model.js";

const checkSchemeId = async (req, res, next) => {
  try {
    const validateId = await db("schemes")
      .where("scheme_id", req.params.scheme_id)
      .first();

    if (!validateId) {
      res.status(404).json({
        message: `scheme with scheme_id ${req.params.scheme_id} not found`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};


const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;
  if (
    scheme_name === "" ||
    scheme_name === undefined ||
    typeof scheme_name != "string"
  ) {
    res.status(400).json({
      message: "invalid scheme_name",
    });
  } else {
    next();
  }
};


const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;
  if (
    instructions === "" ||
    instructions === undefined ||
    typeof instructions != "string" ||
    step_number < 0 ||
    typeof step_number != "number"
  ) {
    res.status(400).json({
      message: "invalid step",
    });
  } else {
    next();
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};

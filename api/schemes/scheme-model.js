const db = require("../../data/db-config");

async function find() {
  
  const rows = await db("schemes as sc")
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .leftJoin("steps as st", "sc.scheme_id", "=", "st.scheme_id")
    .orderBy("sc.scheme_id")
    .groupBy("sc.scheme_id");

 
  return rows;
}

async function findById(scheme_id) {
  const rows = await db("schemes as sc")
    .select("sc.scheme_name", "st.*")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number");
  const newObj = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: [],
  };
  rows.forEach((row) => {
    if (row.step_id) {
      newObj.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        instructions: row.instructions,
      });
    }
  });
  return newObj;
  
}

async function findSteps(scheme_id) {
 
  const rows = await db("schemes as sc")
    .select("sc.scheme_name", "st.step_number", "st.instructions", "st.step_id")
    .join("steps as st", "sc.scheme_id", "st.scheme_id")
    .where("st.scheme_id", scheme_id)
    .orderBy("st.step_number");

  return rows;


}

async function add(scheme) {
  
  const [scheme_id] = await db("schemes").insert(scheme);

  return db("schemes").where("scheme_id", scheme_id).first();
}

function addStep(scheme_id, step) {
  
  return db("steps")
    .insert({
      ...step,
      scheme_id,
    })
    .then(() => {
      return db("steps").where("scheme_id", scheme_id).orderBy("step_number");
    });
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
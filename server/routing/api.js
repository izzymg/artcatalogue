const Router = require("koa-tree-router");
const cobody = require("co-body");
const repo = require("../db/repo");

const router = new Router({
  onMethodNotAllowed: (ctx) => ctx.body = "405: Method not allowed.",
});

const sections = ["PHEA", "Jewellery/Textiles", "Paintings", "Sculptures/Ceramics", "Printmakings"];

/**
 * Takes user inputted form data and validates all fields.
 * @returns An array of human readable errors.
*/
function validateForm({ firstName, lastName, title, section, siteMap }) {
  const errors = [];

  if(firstName && lastName) {
    if(firstName.length > 100 || lastName.length > 100) {
      errors.push("Fields must not exceed 100 characters");
    }
  } else {
    errors.push("First and last names required");
  }

  if(title && title.length > 50) {
    errors.push("Title must not exceed 50 characters");
  }

  if(sections.indexOf(section) == -1) {
    errors.push("Invalid section");
  }

  const siteMapInt = parseInt(siteMap);
  if(!siteMapInt || siteMapInt > 100 || siteMapInt < 1) {
    errors.push("Site MAP number must be from 1 to 100");
  }

  return errors;
}

// CSV GET handler
router.get(
  "/entries.csv",
  async function(ctx) {
    ctx.set("Content-Type", "text/csv");
    ctx.body = await repo.getCsv();
  }
)

// Form GET handler
router.get(
  "/forms/:id",
  async function(ctx) {
    const formId = ctx.params.id;
    const formData = await repo.getForm(formId);
    ctx.assert(formData, 404, "No form found by that ID");
    ctx.body = {
      message: "Success",
      formData,
    };
  }
)

// Form POST handler
router.post(
  "/",
  async function(ctx) {

    const formData = await cobody.json(ctx, { strict: true, });
    const formErrors = validateForm(formData);
    if(formErrors.length > 0) {
      ctx.throw(400, formErrors[0]);
      return;
    }
    
    const formId = await repo.insertForm(formData);
    ctx.body = {
      message: `Success, your form ID is ${formId}`,
      formId,
    };
  }
);

module.exports = router;
const objectToFormData = (obj, form, namespace) => {
  const fd = form || new FormData();

  for (const property in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, property)) {
      continue;
    }

    const formKey = namespace ? `${namespace}[${property}]` : property;

    // if the property is an object or array, but not a File
    if (typeof obj[property] === "object" && !(obj[property] instanceof File)) {
      if (Object.keys(obj[property]).length === 0) {
        // explicit null
        fd.append(formKey, "");
        continue;
      }

      // set recursively
      objectToFormData(obj[property], fd, formKey);
      continue;
    }

    // if it's a boolean
    if (typeof obj[property] === "boolean") {
      fd.append(formKey, obj[property] ? "1" : "0");
      continue;
    }

    // if it's a string or a File object
    fd.append(formKey, obj[property]);
  }

  return fd;
};

export default objectToFormData;

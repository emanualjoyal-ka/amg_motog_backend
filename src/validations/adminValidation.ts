import Joi from "joi";


export const RegisterValdidation=Joi.object({
    userName:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required(),
    role:Joi.string().valid("admin", "superadmin").default("admin")
});


export const LoginValidation=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
})
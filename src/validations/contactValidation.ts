import Joi, { required } from "joi";


export const contactValidation=Joi.object({
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    subject:Joi.string().required(),
    message:Joi.string().required()
})
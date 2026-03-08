import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_ID,
        pass:process.env.EMAIL_PASS
    }
});


const sendNotification=async(data:any)=>{
    try {
        const info=await transport.sendMail({
            from: `"AMG Moto Website" <${process.env.EMAIL_ID}>`, 
            to: process.env.OWNER_EMAILS, 
            subject: `🚨 NEW REQUEST: ${data.partName} for ${data.bikeBrand}`,
            html: `
                <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
                    <h2>New Customer Request Received</h2>
                    <hr/>
                    <p><strong>Customer:</strong> ${data.fullName}</p>
                    <p><strong>Phone:</strong> ${data.phone}</p>
                    <p><strong>Bike:</strong> ${data.bikeBrand} ${data.bikeModel} (${data.year || 'No year given'})</p>
                    <p><strong>Part Needed:</strong> ${data.partName}</p>
                    <p><strong>Condition:</strong> ${data.condition}</p>
                    <p><strong>Address:</strong> ${data.address}</p>
                    <p><strong>Message:</strong> ${data.description || 'No description'}</p>
                    <br/>
                    <div style="text-align: center;">
                        <img src="${data.image}" alt="Part Image" style="max-width: 300px; border-radius: 10px;" />
                        <br/>
                        <a href="${data.image}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #e63946; color: #fff; text-decoration: none; border-radius: 5px;">View Full Image</a>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.log("❌ Email Error:",error);
    }
}

export default sendNotification;
import { app } from "./app.js";
import connectDB from "./DB/db.connect.js";


connectDB()
.then(()=>{
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
})
.catch((error)=>{
    console.log(error);
})





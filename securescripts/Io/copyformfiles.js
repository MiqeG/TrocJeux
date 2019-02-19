const fs2 = require('fs-extra');
let path=require('path')
class IoOp
{
    static copyFiles(temp_path,new_location,file_name,annonce_ID){
    
        fs2.copy(temp_path, new_location + annonce_ID+'/'+path.basename(temp_path), function (err) {
          if (err) {
            console.error(err);
          } else {
            fs2.unlink(temp_path, (err) => {
              if (err) throw err;
              
              console.log("temp file deleted");
             
            });
          
          
          }
        });
       }
}
module.exports=IoOp

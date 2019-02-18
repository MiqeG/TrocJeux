
const fs2 = require('../../node_modules/fs-extra');
let path=require('../../node_modules/path')
class IoOp
{
    static copyFiles(temp_path,new_location,file_name){
        fs2.copy(temp_path, new_location + path.basename(temp_path), function (err) {
          if (err) {
            console.error(err);
          } else {
            fs2.unlink(temp_path, (err) => {
              if (err) throw err;
              console.log("tempfile deleted");
            });
          
          
          }
        });
       }
}
module.exports=IoOp

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOP_FINAL_PROJECT
{
    public class DataConvertion
    {
        public static string Serialize(DataToServer dts) => Newtonsoft.Json.JsonConvert.SerializeObject(dts);
        public static DataFromServer Deserialize(string json) => Newtonsoft.Json.JsonConvert.DeserializeObject<DataFromServer>(json);
    }
}

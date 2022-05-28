using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOP_FINAL_PROJECT
{
    public class DataToServer
    {
        public string Type { get; set; }
        public string CurrentUsername { get; set; }
        public string OpponentUsername { get; set; }
        public List<int> HomeSpotCoords { get; set; }
        public List<int> TargetSpotCoords { get; set; }
    }
}

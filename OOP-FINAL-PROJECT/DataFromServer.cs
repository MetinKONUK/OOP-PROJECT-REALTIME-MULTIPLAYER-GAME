using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOP_FINAL_PROJECT
{
    public class DataFromServer
    {
        public string Type { get; set; }

        public List<List<int>> NewShapeCoordinates = new List<List<int>>();
        public bool GameStartedFeedback = false;
        public bool HomeSpotSetRequestFeedback = false;
        public bool TargetSpotSetRequestFeedback = false;
        public List<List<int>> Path = null;
        public string Turn = null;
        public string ErrorMessage = null;
        public List<int> ClearSpotsData = null;
        public string GameEndInfo = null;
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace OOP_FINAL_PROJECT
{
    public partial class GameForm : Form
    {
        public static GameForm GameFormInstance;
        public Panel GameFormLowerPanel;
        public GameForm()
        {
            InitializeComponent();
            Control.CheckForIllegalCrossThreadCalls = false;
            GameFormInstance = this;
            WindowState = FormWindowState.Maximized;
            GameFormLowerPanel = new Panel
            {
                Dock = DockStyle.Fill
            };
            Controls.Add(GameFormLowerPanel);
        }

        private void PlayButton_Click(object sender, EventArgs e)
        {
            UserBase.CurrentUser.OpponentUsername = OpponentUsernameTextBox.Text;
            var OpponentUsername = OpponentUsernameTextBox.Text;
            Board.SetOpponent(OpponentUsername);
        }
    }
}

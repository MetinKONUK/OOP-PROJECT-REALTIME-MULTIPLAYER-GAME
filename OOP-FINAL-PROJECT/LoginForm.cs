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
    public partial class LoginForm : Form
    {
        public LoginForm()
        {
            InitializeComponent();
        }

        private void LoginButton_Click(object sender, EventArgs e)
        {
            var Username = UsernameTextBox.Text;
            var Password = PasswordTextBox.Text;
            if(Username == Password)
            {
                var user = new User
                {
                    Username = Username
                };
                UserBase.CurrentUser = user;
                Board.Connect();

                GameForm gameForm = new GameForm();
                gameForm.Show();
            }
            
        }
    }
}

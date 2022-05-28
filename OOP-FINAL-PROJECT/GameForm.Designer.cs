
namespace OOP_FINAL_PROJECT
{
    partial class GameForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.OpponentUsernameLabel = new System.Windows.Forms.Label();
            this.OpponentUsernameTextBox = new System.Windows.Forms.TextBox();
            this.UpperPanel = new System.Windows.Forms.Panel();
            this.PlayButton = new System.Windows.Forms.Button();
            this.UpperPanel.SuspendLayout();
            this.SuspendLayout();
            // 
            // OpponentUsernameLabel
            // 
            this.OpponentUsernameLabel.AutoSize = true;
            this.OpponentUsernameLabel.Location = new System.Drawing.Point(12, 12);
            this.OpponentUsernameLabel.Name = "OpponentUsernameLabel";
            this.OpponentUsernameLabel.Size = new System.Drawing.Size(136, 13);
            this.OpponentUsernameLabel.TabIndex = 0;
            this.OpponentUsernameLabel.Text = "Enter Opponent Username:";
            // 
            // OpponentUsernameTextBox
            // 
            this.OpponentUsernameTextBox.Location = new System.Drawing.Point(151, 9);
            this.OpponentUsernameTextBox.Name = "OpponentUsernameTextBox";
            this.OpponentUsernameTextBox.Size = new System.Drawing.Size(187, 20);
            this.OpponentUsernameTextBox.TabIndex = 1;
            // 
            // UpperPanel
            // 
            this.UpperPanel.Controls.Add(this.PlayButton);
            this.UpperPanel.Controls.Add(this.OpponentUsernameLabel);
            this.UpperPanel.Controls.Add(this.OpponentUsernameTextBox);
            this.UpperPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.UpperPanel.Location = new System.Drawing.Point(0, 0);
            this.UpperPanel.Name = "UpperPanel";
            this.UpperPanel.Size = new System.Drawing.Size(800, 38);
            this.UpperPanel.TabIndex = 2;
            // 
            // PlayButton
            // 
            this.PlayButton.Location = new System.Drawing.Point(344, 9);
            this.PlayButton.Name = "PlayButton";
            this.PlayButton.Size = new System.Drawing.Size(75, 23);
            this.PlayButton.TabIndex = 2;
            this.PlayButton.Text = "Play";
            this.PlayButton.UseVisualStyleBackColor = true;
            this.PlayButton.Click += new System.EventHandler(this.PlayButton_Click);
            // 
            // GameForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.UpperPanel);
            this.Name = "GameForm";
            this.Text = "GameForm";
            this.UpperPanel.ResumeLayout(false);
            this.UpperPanel.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label OpponentUsernameLabel;
        private System.Windows.Forms.TextBox OpponentUsernameTextBox;
        private System.Windows.Forms.Panel UpperPanel;
        private System.Windows.Forms.Button PlayButton;
    }
}
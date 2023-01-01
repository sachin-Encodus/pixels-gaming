const User = require('../src/models/user');
const expressJwt = require('express-jwt');

exports.readController = (req, res) => {
    const userId = req.params.id;
    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                errors: 'User not found'
            });
        }
      
        res.json(user);
        console.log(user);
    });
};

exports.updateController = (req, res) => {
    
    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { name, role, email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                errors: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                errors: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    errors: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

       
            if (role === null) {
                return res.status(400).json({
                    errors: 'please enter a role'
                });
            } else {
                user.role = role;
            }
      

  if (email) {
            if (!email) {
                return res.status(400).json({
                    errors: 'Please enter a email'
                });
            } else {
                user.email = email;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    errors: 'User update failed'
                });
            }
         
            res.json(updatedUser);
        });
    });
};
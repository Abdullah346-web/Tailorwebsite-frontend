// In-memory users store. Seed by signing up (role can be 'user' or 'admin').
// Pre-seeded admin account for convenience; password is 'abdullah12345'.
const users = [
	{
		id: 'admin-1',
		name: 'Abdullahadmin',
		email: 'admin123@gmail.com',
		password: '$2a$10$OlvGwUdlN/diJruftIt2d.0jnMRXvKmypTcRcqRDNwiHNxaC/gcBq',
		role: 'admin',
	},
];

module.exports = users;

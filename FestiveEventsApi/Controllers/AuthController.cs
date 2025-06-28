using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FestiveEventsApi.Data;
using FestiveEventsApi.DTOs;
using FestiveEventsApi.Models;
using System.Security.Cryptography;
using System.Text;

namespace FestiveEventsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserResponseDto>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null)
            {
                return Unauthorized(new { error = "Credenciais inválidas" });
            }

            var hashedPassword = HashPassword(loginDto.Password);

            if (user.PasswordHash != hashedPassword)
            {
                return Unauthorized(new { error = "Credenciais inválidas" });
            }

            var userResponse = new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };

            return Ok(userResponse);
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}

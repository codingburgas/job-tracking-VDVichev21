using JobTracking.DataAccess.Data;
using JobTracking.DataAccess.Data.Base;
using JobTracking.Domain.Configuration;
using JobTracking.Domain.DTOs;
using JobTracking.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JobTracking.Application.Services;

public class AuthService
{
    private readonly JobTrackingDbContext _context;
    private readonly JwtSettings _jwtSettings;

    public AuthService(JobTrackingDbContext context, IOptions<JwtSettings> jwtSettings)
    {
        _context = context;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        try
        {
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            
            if (user == null)
            {
                return null;
            }

            
            var passwordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            
            if (!passwordValid)
            {
                return null;
            }

            var token = GenerateJwtToken(user);
            
            var response = new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    MiddleName = user.MiddleName,
                    LastName = user.LastName,
                    Username = user.Username,
                    Role = user.Role
                }
            };
            
            return response;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        try
        {
            
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                return null;
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var user = new User
            {
                FirstName = registerDto.FirstName,
                MiddleName = registerDto.MiddleName,
                LastName = registerDto.LastName,
                Username = registerDto.Username,
                PasswordHash = passwordHash,
                Role = UserRole.USER, // Everyone is a regular user
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();


            var token = GenerateJwtToken(user);
            
            var response = new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    MiddleName = user.MiddleName,
                    LastName = user.LastName,
                    Username = user.Username,
                    Role = user.Role
                }
            };
            
            return response;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    private string GenerateJwtToken(User user)
    {
        try
        {
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, 
                    new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), 
                    ClaimValueTypes.Integer64)
            };

            

            var expiration = DateTime.UtcNow.AddHours(_jwtSettings.ExpirationHours);
           

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiration,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            
            return tokenString;
        }
        catch (Exception ex)
        {
            throw;
        }
    }
}
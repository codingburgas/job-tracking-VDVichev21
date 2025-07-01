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
            Console.WriteLine($"🔄 Login attempt for username: {loginDto.Username}");
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            
            if (user == null)
            {
                Console.WriteLine("❌ User not found");
                return null;
            }

            Console.WriteLine($"✅ User found: {user.Username}, ID: {user.Id}");
            
            var passwordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            Console.WriteLine($"🔐 Password verification result: {passwordValid}");
            
            if (!passwordValid)
            {
                Console.WriteLine("❌ Password verification failed");
                return null;
            }

            var token = GenerateJwtToken(user);
            Console.WriteLine($"🎫 Generated JWT token for user: {user.Username}");
            
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
            
            Console.WriteLine($"✅ Login successful for: {user.Username}");
            return response;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Login error: {ex.Message}");
            return null;
        }
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        try
        {
            Console.WriteLine($"🔄 Registration attempt for username: {registerDto.Username}");
            
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                Console.WriteLine("❌ Username already exists");
                return null;
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            Console.WriteLine($"🔐 Password hashed successfully");

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

            Console.WriteLine($"🔄 Creating user");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            Console.WriteLine($"✅ New user registered successfully: {user.Username}");

            var token = GenerateJwtToken(user);
            Console.WriteLine($"🎫 Generated JWT token for new user: {user.Username}");
            
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
            
            Console.WriteLine($"✅ Registration complete for: {user.Username}");
            return response;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Registration error: {ex.Message}");
            return null;
        }
    }

    private string GenerateJwtToken(User user)
    {
        try
        {
            Console.WriteLine($"🔧 Generating JWT token for user ID: {user.Id}, Username: {user.Username}");
            Console.WriteLine($"🔧 Using JWT settings - Issuer: {_jwtSettings.Issuer}, Audience: {_jwtSettings.Audience}");
            
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

            Console.WriteLine($"🎫 Claims created: {claims.Length} claims");
            foreach (var claim in claims)
            {
                Console.WriteLine($"   - {claim.Type}: {claim.Value}");
            }

            var expiration = DateTime.UtcNow.AddHours(_jwtSettings.ExpirationHours);
            Console.WriteLine($"⏰ Token expiration: {expiration}");

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiration,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            
            Console.WriteLine($"✅ JWT token generated successfully. Length: {tokenString.Length}");
            Console.WriteLine($"🎫 Token preview: {tokenString.Substring(0, Math.Min(50, tokenString.Length))}...");
            
            return tokenString;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ JWT token generation error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }
    }
}
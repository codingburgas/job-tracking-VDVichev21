using JobTracking.Application.Services;
using JobTracking.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace JobTracking.API.Controllers.Common;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            Console.WriteLine($"🔄 Login request received for: {loginDto.Username}");
            
            if (!ModelState.IsValid)
            {
                Console.WriteLine("❌ Model state is invalid");
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                Console.WriteLine("❌ Login failed - invalid credentials");
                return Unauthorized("Invalid username or password");
            }

            Console.WriteLine($"✅ Login successful for: {loginDto.Username}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Login controller error: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            Console.WriteLine($"🔄 Registration request received for: {registerDto.Username}");
            
            if (!ModelState.IsValid)
            {
                Console.WriteLine("❌ Model state is invalid");
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(registerDto);
            if (result == null)
            {
                Console.WriteLine("❌ Registration failed - username already exists");
                return BadRequest("Username already exists");
            }

            Console.WriteLine($"✅ Registration successful for: {registerDto.Username}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Registration controller error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, "Internal server error");
        }
    }
}
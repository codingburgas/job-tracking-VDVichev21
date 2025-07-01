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
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized("Invalid username or password");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(registerDto);
            if (result == null)
            {
                return BadRequest("Username already exists");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }
}
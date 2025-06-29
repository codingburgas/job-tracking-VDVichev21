namespace JobPortal.API.Services;

public class FileUploadService
{
    private readonly string _uploadsPath;
    private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB
    private readonly string[] _allowedExtensions = { ".pdf" };

    public FileUploadService(IWebHostEnvironment environment)
    {
        _uploadsPath = Path.Combine(environment.ContentRootPath, "uploads", "resumes");
        Directory.CreateDirectory(_uploadsPath);
    }

    public async Task<FileUploadResult> UploadResumeAsync(IFormFile file, int userId)
    {
        try
        {
            // Validate file
            var validationResult = ValidateFile(file);
            if (!validationResult.Success)
            {
                return validationResult;
            }

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var fileName = $"resume_{userId}_{DateTime.UtcNow:yyyyMMdd_HHmmss}{fileExtension}";
            var filePath = Path.Combine(_uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return new FileUploadResult
            {
                Success = true,
                FileName = file.FileName,
                FilePath = fileName // Store relative path
            };
        }
        catch (Exception ex)
        {
            return new FileUploadResult
            {
                Success = false,
                ErrorMessage = $"File upload failed: {ex.Message}"
            };
        }
    }

    public async Task<FileDownloadResult> GetResumeAsync(string filePath)
    {
        try
        {
            var fullPath = Path.Combine(_uploadsPath, filePath);
            
            if (!File.Exists(fullPath))
            {
                return new FileDownloadResult
                {
                    Success = false,
                    ErrorMessage = "File not found"
                };
            }

            var fileContent = await File.ReadAllBytesAsync(fullPath);
            
            return new FileDownloadResult
            {
                Success = true,
                FileContent = fileContent
            };
        }
        catch (Exception ex)
        {
            return new FileDownloadResult
            {
                Success = false,
                ErrorMessage = $"File download failed: {ex.Message}"
            };
        }
    }

    private FileUploadResult ValidateFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return new FileUploadResult
            {
                Success = false,
                ErrorMessage = "No file provided"
            };
        }

        if (file.Length > _maxFileSize)
        {
            return new FileUploadResult
            {
                Success = false,
                ErrorMessage = "File size exceeds 5MB limit"
            };
        }

        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(fileExtension))
        {
            return new FileUploadResult
            {
                Success = false,
                ErrorMessage = "Only PDF files are allowed"
            };
        }

        return new FileUploadResult { Success = true };
    }
}

public class FileUploadResult
{
    public bool Success { get; set; }
    public string? FileName { get; set; }
    public string? FilePath { get; set; }
    public string? ErrorMessage { get; set; }
}

public class FileDownloadResult
{
    public bool Success { get; set; }
    public byte[]? FileContent { get; set; }
    public string? ErrorMessage { get; set; }
}
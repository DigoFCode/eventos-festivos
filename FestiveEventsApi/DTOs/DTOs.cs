using System.ComponentModel.DataAnnotations;

namespace FestiveEventsApi.DTOs
{
    public class CreateUserDto
    {
        [Required]
        [StringLength(80, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(120)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        [StringLength(80, MinimumLength = 3)]
        public string? Username { get; set; }

        [EmailAddress]
        [StringLength(120)]
        public string? Email { get; set; }

        [StringLength(100, MinimumLength = 6)]
        public string? Password { get; set; }
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateEventDto
    {
        [Required]
        [StringLength(200, MinimumLength = 3)]
        public string EventName { get; set; } = string.Empty;

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        public string EventAddress { get; set; } = string.Empty;

        public string? EventDescription { get; set; }

        public string? ImageUrl { get; set; }

        [Required]
        public int UserId { get; set; }
    }

    public class UpdateEventDto
    {
        [StringLength(200, MinimumLength = 3)]
        public string? EventName { get; set; }

        public DateTime? EventDate { get; set; }

        public string? EventAddress { get; set; }

        public string? EventDescription { get; set; }

        public string? ImageUrl { get; set; }

        public int? UserId { get; set; }
    }

    public class EventResponseDto
    {
        public int Id { get; set; }
        public string EventName { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string EventAddress { get; set; } = string.Empty;
        public string? EventDescription { get; set; }
        public string? ImageUrl { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class UploadResponseDto
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FestiveEventsApi.Data;
using FestiveEventsApi.Models;
using FestiveEventsApi.DTOs;

namespace FestiveEventsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventResponseDto>>> GetEvents()
        {
            var events = await _context.FestiveEvents
                .Include(e => e.User)
                .Select(e => new EventResponseDto
                {
                    Id = e.Id,
                    EventName = e.EventName,
                    EventDate = e.EventDate,
                    EventAddress = e.EventAddress,
                    EventDescription = e.EventDescription,
                    ImageUrl = e.ImageUrl,
                    UserId = e.UserId,
                    UserName = e.User.Username,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();

            return Ok(events);
        }

        // GET: api/events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventResponseDto>> GetEvent(int id)
        {
            var festiveEvent = await _context.FestiveEvents
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (festiveEvent == null)
            {
                return NotFound(new { error = "Evento não encontrado" });
            }

            var eventResponse = new EventResponseDto
            {
                Id = festiveEvent.Id,
                EventName = festiveEvent.EventName,
                EventDate = festiveEvent.EventDate,
                EventAddress = festiveEvent.EventAddress,
                EventDescription = festiveEvent.EventDescription,
                ImageUrl = festiveEvent.ImageUrl,
                UserId = festiveEvent.UserId,
                UserName = festiveEvent.User.Username,
                CreatedAt = festiveEvent.CreatedAt
            };

            return Ok(eventResponse);
        }

        // POST: api/events
        [HttpPost]
        public async Task<ActionResult<EventResponseDto>> CreateEvent(CreateEventDto createEventDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user exists
            var user = await _context.Users.FindAsync(createEventDto.UserId);
            if (user == null)
            {
                return BadRequest(new { error = "Usuário não encontrado" });
            }

            var festiveEvent = new FestiveEvent
            {
                EventName = createEventDto.EventName,
                EventDate = createEventDto.EventDate,
                EventAddress = createEventDto.EventAddress,
                EventDescription = createEventDto.EventDescription,
                ImageUrl = createEventDto.ImageUrl,
                UserId = createEventDto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.FestiveEvents.Add(festiveEvent);
            await _context.SaveChangesAsync();

            // Load the user for response
            await _context.Entry(festiveEvent)
                .Reference(e => e.User)
                .LoadAsync();

            var eventResponse = new EventResponseDto
            {
                Id = festiveEvent.Id,
                EventName = festiveEvent.EventName,
                EventDate = festiveEvent.EventDate,
                EventAddress = festiveEvent.EventAddress,
                EventDescription = festiveEvent.EventDescription,
                ImageUrl = festiveEvent.ImageUrl,
                UserId = festiveEvent.UserId,
                UserName = festiveEvent.User.Username,
                CreatedAt = festiveEvent.CreatedAt
            };

            return CreatedAtAction(nameof(GetEvent), new { id = festiveEvent.Id }, eventResponse);
        }

        // PUT: api/events/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, UpdateEventDto updateEventDto)
        {
            var festiveEvent = await _context.FestiveEvents.FindAsync(id);

            if (festiveEvent == null)
            {
                return NotFound(new { error = "Evento não encontrado" });
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(updateEventDto.EventName))
            {
                festiveEvent.EventName = updateEventDto.EventName;
            }

            if (updateEventDto.EventDate.HasValue)
            {
                festiveEvent.EventDate = updateEventDto.EventDate.Value;
            }

            if (!string.IsNullOrEmpty(updateEventDto.EventAddress))
            {
                festiveEvent.EventAddress = updateEventDto.EventAddress;
            }

            if (updateEventDto.EventDescription != null)
            {
                festiveEvent.EventDescription = updateEventDto.EventDescription;
            }

            if (updateEventDto.ImageUrl != null)
            {
                festiveEvent.ImageUrl = updateEventDto.ImageUrl;
            }

            if (updateEventDto.UserId.HasValue)
            {
                // Check if user exists
                var user = await _context.Users.FindAsync(updateEventDto.UserId.Value);
                if (user == null)
                {
                    return BadRequest(new { error = "Usuário não encontrado" });
                }
                festiveEvent.UserId = updateEventDto.UserId.Value;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/events/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var festiveEvent = await _context.FestiveEvents.FindAsync(id);
            if (festiveEvent == null)
            {
                return NotFound(new { error = "Evento não encontrado" });
            }

            _context.FestiveEvents.Remove(festiveEvent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(int id)
        {
            return _context.FestiveEvents.Any(e => e.Id == id);
        }
    }
}


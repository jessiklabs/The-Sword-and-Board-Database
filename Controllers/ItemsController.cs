using Microsoft.AspNetCore.Mvc;
using Catalog1.Repositories;
using System.Collections.Generic;
using Catalog1.Entities;
using System;
using System.Linq;
using Catalog1.Dtos;
using System.Threading.Tasks;

namespace Catalog1.Controllers
{
    //GET /items
    [ApiController]
    [Route("items")]
    public class ItemsController : ControllerBase
    {
        private readonly IItemsRepository repository;

        public ItemsController(IItemsRepository repository)
        {
            this.repository = repository;
        }
        //GET /items
        [HttpGet]
        public async Task <IEnumerable<ItemDto>> GetItemsAsync()
        {
            var items = (await repository.GetItemsAsync())
                .Select(item => item.AsDto());
            return items;
        }
        //GET /items/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemDto>> GetItemAsync(Guid id)
        {
            var item = await repository.GetItemAsync(id);

            if(item is null){
                return NotFound();
            }
            return item.AsDto();
        }
        //POST /items
        [HttpPost]
        public async Task<ActionResult<ItemDto>> CreateItemAsync(CreateItemDto itemDto)
        {
            Item item = new() {
                Id = Guid.NewGuid(),
                Name = itemDto.Name,
                Age = itemDto.Age,
                Birthplace = itemDto.Birthplace,
                Element = itemDto.Element,
                Description = itemDto.Description,
                Bio = itemDto.Bio,
                ImgUrl = itemDto.ImgUrl,
                CreatedDate = DateTimeOffset.UtcNow
            };

            await repository.CreateItemAsync(item);

            return CreatedAtAction(nameof(GetItemAsync), new {id = item.Id}, item.AsDto());
        }
        //Put /items/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateItemAsync(Guid id, UpdateItemDto itemDto)
        {
            var existingItem = await repository.GetItemAsync(id);

            if(existingItem is null)
            {
                return NotFound();
            }

            Item updatedItem = existingItem with {
                Name = itemDto.Name,
                Age = itemDto.Age,
                Birthplace = itemDto.Birthplace,
                Element = itemDto.Element,
                Description = itemDto.Description,
                Bio = itemDto.Bio,
                ImgUrl = itemDto.ImgUrl
            };

            await repository.UpdateItemAsync(updatedItem);

            return NoContent();
        }

        //DELETE /items/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteItem(Guid id){
            var existingItem = await repository.GetItemAsync(id);

            if(existingItem is null)
            {
                return NotFound();
            }

            await repository.DeleteItemAsync(id);
            return NoContent();

        }
    }
}
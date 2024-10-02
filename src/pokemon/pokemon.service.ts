import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonEntity: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    console.log(createPokemonDto);

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = new this.pokemonEntity(createPokemonDto);
      await pokemon.save();
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonEntity
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1,
      })
      .select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon;
    if (!isNaN(+id)) pokemon = await this.pokemonEntity.findOne({ no: id });
    //todo mongo id
    if (!pokemon && isValidObjectId(id))
      pokemon = await this.pokemonEntity.findById(id);
    //todomongo name
    if (!pokemon)
      pokemon = await this.pokemonEntity.findOne({
        name: id.toLowerCase().trim(),
      });
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${id} not found"`,
      );
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(id);

      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonEntity.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new NotFoundException(`pokemon with id "${id}" not found`);
    return;
  }

  handleExceptions(error: any) {
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];

      if (duplicatedField === 'name') {
        throw new BadRequestException(
          `El Pokémon con el nombre '${error.keyValue.name}' ya existe.`,
        );
      }

      if (duplicatedField === 'no') {
        throw new BadRequestException(
          `El Pokémon con el número '${error.keyValue.no}' ya existe.`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        'No se puede crear el Pokémon - revisa los logs del servidor',
      );
    }
  }
  executeSeed(createPokemonDto: CreatePokemonDto) {
    this.create(createPokemonDto);
  }
}

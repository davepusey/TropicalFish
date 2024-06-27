using System;

namespace MinecraftTropicalFishGen
{
    internal class CustomModelDataMappings
    {
		public static int GetShapePattern(FishType type)
		{
			return type switch
			{
				FishType.Betty => 0,
				FishType.Blockfish => 1,
				FishType.Brinely => 2,
				FishType.Clayfish => 3,
				FishType.Dasher => 4,
				FishType.Flopper => 5,
				FishType.Glitter => 6,
				FishType.Kob => 7,
				FishType.Snooper => 8,
				FishType.Spotty => 9,
				FishType.Stripey => 10,
				FishType.Sunstreak => 11,
				FishType.Named => throw new ArgumentOutOfRangeException(nameof(type), type, "Value must not be \"Named\""),
				_ => throw new ArgumentOutOfRangeException(nameof(type), type, "Value not recognised")
			};
		}

		public static int GetColour(Colour colour)
        {
			return colour switch
			{
				Colour.Blue => 0,
				Colour.Brown => 1,
				Colour.Cyan => 2,
				Colour.Gray => 3,
				Colour.Green => 4,
				Colour.LightBlue => 5,
				Colour.LightGray => 6,
				Colour.Lime => 7,
				Colour.Magenta => 8,
				Colour.Orange => 9,
				Colour.Pink => 10,
				Colour.Purple => 11,
				Colour.Red => 12,
				Colour.White => 13,
				Colour.Yellow => 14,
				_ => throw new ArgumentOutOfRangeException(nameof(colour), colour, "Value not recognised")
			};
        }
	}
}
using System;
using System.Collections.Generic;

namespace MinecraftTropicalFishGen
{
	internal class TropicalFishVariant
	{
		private static readonly List<TropicalFishVariant> AllColourVariants = [];
		private static readonly List<TropicalFishVariant> AllNamedVariants = [];
		private static readonly Dictionary<FishType, List<TropicalFishVariant>> AllTypeVariants = [];

		public byte Shape { get; init; }
		public byte Pattern { get; init; }
		public byte BaseColour { get; init; }
		public byte PatternColour { get; init; }

		static TropicalFishVariant()
		{
			for (byte shape = 0; shape <= 1; shape++)
			{
				for (byte pattern = 0; pattern <= 5; pattern++)
				{
					for (byte baseColour = 0; baseColour <= 14; baseColour++)
					{
						for (byte patternColour = 0; patternColour <= 14; patternColour++)
						{
							TropicalFishVariant variant = new(shape, pattern, baseColour, patternColour);

							AllColourVariants.Add(variant);
							if (variant.Named != null) AllNamedVariants.Add(variant);

							if (AllTypeVariants.ContainsKey(variant.Type) == false) AllTypeVariants.Add(variant.Type, []);
							AllTypeVariants[variant.Type].Add(variant);
						}
					}
				}
			}
		}

		public override string ToString()
		{
			return Id;
		}

		public static List<TropicalFishVariant> GetAllColourVariants()
		{
			return AllColourVariants;
		}

		public static List<TropicalFishVariant> GetAllTypeVariants(FishType type)
		{
			return (type == FishType.Named) ? AllNamedVariants : AllTypeVariants[type];
		}

		public TropicalFishVariant(byte shape, byte pattern, byte baseColour, byte patternColour)
		{
			if (shape > 1) throw new ArgumentOutOfRangeException(nameof(shape), shape, "Must be between 0 and 1 (inclusive)");
			if (pattern > 5) throw new ArgumentOutOfRangeException(nameof(pattern), pattern, "Must be between 0 and 5 (inclusive)");
			if (baseColour > 14) throw new ArgumentOutOfRangeException(nameof(baseColour), baseColour, "Must be between 0 and 14 (inclusive)");
			if (patternColour > 14) throw new ArgumentOutOfRangeException(nameof(patternColour), patternColour, "Must be between 0 and 14 (inclusive)");

			Shape = shape;
			Pattern = pattern;
			BaseColour = baseColour;
			PatternColour = patternColour;
		}

		public string Id
		{
			get
			{
				string id = ShapePatternName + "_" + (Colour)BaseColour + "_" + (Colour)PatternColour;
				return id.ToLower();
			}
		}

		public string? NamedId
		{
			get
			{
				if (Named == null) return null;
				return Named.Replace(" ","_").ToLower();
			}
		}

		public string Name
		{
			get
			{
				return (Colour)BaseColour + "-" + (Colour)PatternColour + " " + ShapePatternName;
			}
		}

		public string ShapePatternName
		{
			get
			{
				return Type.ToString();
			}
		}

		public static string GetShapePatternName(byte shape, byte pattern)
		{
			return FindType(shape, pattern).ToString();
		}

		public string CustomModelData
		{
			get
			{
				int shapePatternMapping = CustomModelDataMappings.GetShapePattern(Type) + 1;
				int baseColourMapping = CustomModelDataMappings.GetColour((Colour)BaseColour) + 1;
				int patternColourMapping = CustomModelDataMappings.GetColour((Colour)PatternColour) + 1;

				return "1" + shapePatternMapping.ToString("D2") + baseColourMapping.ToString("D2") + patternColourMapping.ToString("D2");
			}
		}

		public int BucketVariantTag
		{
			get
			{
				int bucketVariantTag = Shape;
				bucketVariantTag += (Pattern << 8);
				bucketVariantTag += (BaseColour << 16);
				bucketVariantTag += (PatternColour << 24);

				return bucketVariantTag;
			}
		}

		public string? Named
		{
			get
			{
				// See https://minecraft.wiki/w/Tropical_Fish#Entity_data

				return BucketVariantTag switch
				{
					65536 => "Clownfish",
					459008 => "Triggerfish",
					917504 => "Tomato Clownfish",
					918273 => "Red Snapper",
					918529 => "Red Cichlid",
					16778497 => "Ornate Butterflyfish",
					50660352 => "Queen Angelfish",
					50726144 => "Cotton Candy Betta",
					67108865 => "Threadfin",
					67110144 => "Goatfish",
					67371009 => "Yellow Tang",
					67699456 => "Yellowtail Parrotfish",
					67764993 => "Dottyback",
					101253888 => "Parrotfish",
					117441025 => "Moorish Idol",
					117441793 => "Butterflyfish",
					117506305 => "Anemone",
					117899265 => "Black Tang",
					118161664 => "Cichlid",
					185008129 => "Blue Tang",
					234882305 => "Emperor Red Snapper",
					235340288 => "Red Lipped Blenny",
					_ => null
				};
			}
		}

		public string Parent
		{
			get
			{
				string parent = "tropicalfish:" + GetShapePatternName(Shape, Pattern) + "/";
				parent += (PatternColour == 0) ? "root" : (Colour)BaseColour + "/" + (Colour)(PatternColour - 1);
				return parent.ToLower();
			}
		}

		public string? NamedAdvancementFilePath
		{
			get
			{
				if (Named == null) return null;
				return ("named\\" + Named.Replace(" ", "_") + ".json").ToLower();
			}
		}

		public string AdvancementFilePath
		{
			get
			{
				return (ShapePatternName + "\\" + (Colour)BaseColour + "\\" + (Colour)PatternColour + ".json").ToLower();
			}
		}

		public FishType Type
		{
			get
			{
				return FindType(Shape, Pattern);
			}
		}

		public static FishType FindType(byte shape, byte pattern)
		{
			// See https://minecraft.wiki/w/Tropical_Fish#Entity_data

			if (shape == 0)
			{
				return pattern switch
				{
					0 => FishType.Kob,
					1 => FishType.Sunstreak,
					2 => FishType.Snooper,
					3 => FishType.Dasher,
					4 => FishType.Brinely,
					5 => FishType.Spotty,
					_ => throw new ArgumentOutOfRangeException(nameof(pattern), pattern, "Must be between 0 and 5 (inclusive)")
				};
			}
			else if (shape == 1)
			{
				return pattern switch
				{
					0 => FishType.Flopper,
					1 => FishType.Stripey,
					2 => FishType.Glitter,
					3 => FishType.Blockfish,
					4 => FishType.Betty,
					5 => FishType.Clayfish,
					_ => throw new ArgumentOutOfRangeException(nameof(pattern), pattern, "Must be between 0 and 5 (inclusive)")
				};
			}
			else
			{
				throw new ArgumentOutOfRangeException(nameof(shape), shape, "Must be between 0 and 1 (inclusive)");
			}
		}
	}
}

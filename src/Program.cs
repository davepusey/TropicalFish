using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace MinecraftTropicalFishGen
{
	internal class Program
	{
		private static readonly string AdvancementsRootPath = "data\\tropicalfish\\advancement";
		private static readonly string BackgroundPath = "minecraft:textures/block/tube_coral_block.png";
		private static readonly List<string> CheckBucketCommands = [];
		private static string DataPackRootPath = "";

		static void Main()
		{
			string assemblyLocation = Assembly.GetExecutingAssembly().Location;
			DataPackRootPath = assemblyLocation[..assemblyLocation.IndexOf("\\src\\")] + "\\data-pack";

			CleanAdvancementsDirectory();

			foreach (TropicalFishVariant variant in TropicalFishVariant.GetAllColourVariants())
			{
				GenerateColourAdvancement(variant);
				GenerateCheckBucketCommands(variant);
			}

			foreach (FishType type in Enum.GetValues<FishType>())
			{
				GenerateTypeRootAdvancement(type);
			}

			GenerateAllAdvancement();

			CheckBucketCommands.Add("advancement revoke @s only tropicalfish:check_bucket");
			using (TextWriter tw = new StreamWriter(DataPackRootPath + "\\data\\tropicalfish\\function\\check_bucket.mcfunction", false))
			{
				foreach(string command in CheckBucketCommands)
				{
					tw.WriteLine(command);
				}
			}
		}

		private static void CleanAdvancementsDirectory()
		{
			string path = DataPackRootPath + "\\" + AdvancementsRootPath;

			foreach (string d in Directory.GetDirectories(path))
			{
				Directory.Delete(d, true);
			}
			foreach (string f in Directory.GetFiles(path, "*", SearchOption.TopDirectoryOnly))
			{
				if (f.EndsWith("\\check_bucket.json") == false) File.Delete(f);
			}
		}

		private static void GenerateCheckBucketCommands(TropicalFishVariant variant)
		{
			string command = "execute if items entity @s container.*";
			command += " minecraft:tropical_fish_bucket[minecraft:bucket_entity_data={BucketVariantTag:" + variant.BucketVariantTag + ",Health:3.0f}]";
			command += " run advancement grant @s only tropicalfish:";

			CheckBucketCommands.Add(command + variant.Id.Replace("_", "/"));
			CheckBucketCommands.Add(command + variant.ShapePatternName.ToLower() + "/summary " + variant.Id);
			CheckBucketCommands.Add(command + variant.ShapePatternName.ToLower() + "/root " + variant.Id);
			CheckBucketCommands.Add(command + "all " + variant.Id);

			if (variant.Named != null)
			{
				CheckBucketCommands.Add(command + "named/" + variant.NamedId);
				CheckBucketCommands.Add(command + "named/summary " + variant.Id);
				CheckBucketCommands.Add(command + "named/root " + variant.Id);
			}
		}

		private static void GenerateAllAdvancement()
		{
			Advancement a = new()
			{
				Parent = "tropicalfish:root",
				IconItemId = "minecraft:tropical_fish_bucket",
				Title = "All",
				Description = "Catch all Tropical Fish variants",
				Frame = "challenge",
				Background = BackgroundPath
			};

			foreach (TropicalFishVariant variant in TropicalFishVariant.GetAllColourVariants())
			{
				a.Criteria.Add(variant.Id, new());
			}

			string path = AdvancementsRootPath + "\\all.json";
			WriteJsonFile(a, path);
		}

		private static void GenerateColourAdvancement(TropicalFishVariant variant)
		{
			Advancement a = new()
			{
				Parent = variant.Parent,
				IconItemId = "minecraft:tropical_fish",
				IconCustomModelData = variant.CustomModelData,
				Title = variant.Name,
				Description = "Catch a " + variant.Name
			};
			a.Criteria.Add(variant.Id, new());

			string path = AdvancementsRootPath + "\\" + variant.AdvancementFilePath;
			WriteJsonFile(a, path);

			if (variant.Named != null)
			{
				a.Parent = "tropicalfish:named/root";
				a.Title = variant.Named;
				a.Description = "Catch a " + variant.Named;
				path = AdvancementsRootPath + "\\" + variant.NamedAdvancementFilePath;
				WriteJsonFile(a, path);
			}
		}

		private static void GenerateTypeRootAdvancement(FishType type)
		{
			Advancement a = new()
			{
				IconItemId = "minecraft:tropical_fish_bucket",
				Title = "Tropical Fish (" + type + ")",
				Description = "Catch all " + type + " variants",
				Frame = "goal",
				Background = BackgroundPath
			};

			foreach (TropicalFishVariant variant in TropicalFishVariant.GetAllTypeVariants(type))
			{
				a.Criteria.Add(variant.Id, new());
			}

			string path = AdvancementsRootPath + "\\" + type.ToString().ToLower() + "\\root.json";
			WriteJsonFile(a, path);

			a.Parent = "tropicalfish:all";
			a.Title = type.ToString();
			path = AdvancementsRootPath + "\\" + type.ToString().ToLower() + "\\summary.json";
			WriteJsonFile(a, path);
		}

		private static void WriteJsonFile(Advancement a, string path)
		{
			Console.WriteLine(path);

			FileInfo fi = new(DataPackRootPath + "\\" + path);
			fi.Directory?.Create();
			using (TextWriter tw = new StreamWriter(fi.FullName, false))
			{
				tw.Write(a.GetJson());
			}
		}
	}
}
